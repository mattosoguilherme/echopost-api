import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

const prisma = new PrismaService();

const Logged = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const require = ctx.switchToHttp().getRequest();

    const user = require.user as User;

    const u = await prisma.user.findUnique({
      where: { id: user.id },
    });

    return u;
  },
);

export default Logged;