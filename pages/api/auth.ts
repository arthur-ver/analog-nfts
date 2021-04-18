import type { NextApiRequest, NextApiResponse } from 'next'
import { sign, verify } from 'jsonwebtoken'
import { utils } from 'ethers'
import prisma from '../../lib/prisma'
import sha256 from 'crypto-js/sha256'
import Hex from 'crypto-js/enc-hex'

const verifyToken = (token: string) => {
    return new Promise((resolve, reject) => {
        verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err) resolve(false)
            else resolve(true)
        })
    })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {
            const { body } = req
            if (body.authRequest && body.authRequest.signature && body.authRequest.address) {
                const { signature, address } = body.authRequest
                const addressRecovered = utils.verifyMessage('Login message', signature)
                if (address !== addressRecovered.toLowerCase()) {
                    res.status(403).end()
                } else {
                    const user = await prisma.user.findUnique({
                        where: { address },
                        select: { id: true }
                    })
                    if (user) {
                        const authToken = sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: 15*60 })
                        const refreshToken = sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: 7*24*60*60 })
                        const savedRefreshToken = await prisma.user.update({
                            where: { address, },
                            data: { refreshToken, },
                            select: { refreshToken: true },
                        })
                        const refreshTokenHash = sha256(savedRefreshToken.refreshToken).toString(Hex)
                        res.status(200).json({
                            userId: user.id,
                            authToken,
                            refreshTokenHash
                        })
                    } else {
                        res.status(401).json({ unauthorized: true })
                    }
                }            
            } else if (body.verifyRequest && body.verifyRequest.userId && body.verifyRequest.authToken && body.verifyRequest.refreshTokenHash) {
                const { userId, authToken, refreshTokenHash } = body.verifyRequest
                const isAuthTokenValid = await verifyToken(authToken)
                if (isAuthTokenValid) {
                    res.status(200).json({
                        userId,
                        authToken,
                        refreshTokenHash
                    })
                } else {
                    const refreshToken = await prisma.user.findUnique({
                        where: { id: userId, },
                        select: { refreshToken: true, },
                    })
                    const isRefreshTokenValid = await verifyToken(refreshToken.refreshToken)
                    const dbRefreshTokenHash = sha256(refreshToken.refreshToken).toString(Hex)
                    if (dbRefreshTokenHash === refreshTokenHash && isRefreshTokenValid) {
                        const authToken = sign({ userId }, process.env.JWT_SECRET, { expiresIn: 15*60 })
                        res.status(401).json({
                            userId,
                            authToken,
                            refreshTokenHash
                        })
                    } else if (dbRefreshTokenHash === refreshTokenHash && !isRefreshTokenValid) {
                        const authToken = sign({ userId }, process.env.JWT_SECRET, { expiresIn: 15*60 })
                        const refreshToken = sign({ userId }, process.env.JWT_SECRET, { expiresIn: 7*24*60*60 })
                        const savedRefreshToken = await prisma.user.update({
                            where: { id: userId, },
                            data: { refreshToken, },
                            select: { refreshToken: true },
                        })
                        const refreshTokenHash = sha256(savedRefreshToken.refreshToken).toString(Hex)
                        res.status(401).json({
                            userId,
                            authToken,
                            refreshTokenHash
                        })
                    } else {
                        res.status(400).end()
                    }
                }
            } else {
                res.status(502).json({ error: 'Bad gateway 502' })
            }
        } catch (e) {
            res.status(502).json({error: e})
        }
    } else {
        res.status(502).json({ error: 'Bad gateway 502' })
    }
}
