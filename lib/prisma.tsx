import { PrismaClient } from "@prisma/client"

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ log: ["info"] })
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient({ log: ["info"] })
  }
  prisma = (global as any).prisma
}

export default prisma