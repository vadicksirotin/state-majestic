import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "discord") {
        const discordId = account.providerAccountId;
        
        let dbUser = await prisma.user.findUnique({ where: { discordId } });
        
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              discordId,
              name: user.name || "Unknown",
              avatar: user.image,
            }
          });
        }
        
        // Передаем внутренний UUID базы данных как ID пользователя
        user.id = dbUser.id;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.uid = user.id;
        if (account?.providerAccountId) {
          token.discordId = account.providerAccountId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) {
        session.user.id = token.uid as string;
        session.user.discordId = token.discordId as string | undefined;

        // Получаем роли пользователя из БД, чтобы они были доступны во всем приложении через сессию
        const dbUser = await prisma.user.findUnique({
          where: { id: session.user.id },
          include: { roles: true }
        });

        session.user.roles = dbUser ? dbUser.roles : [];
      }
      return session;
    }
  }
};
