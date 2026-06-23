import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { z } from 'zod';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const createTransactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.enum(['MORADIA', 'ALIMENTACAO', 'TRANSPORTE', 'SAUDE', 'LAZER', 'COMPRAS', 'OUTROS', 'SALARIO', 'RENDIMENTOS', 'PIX', 'FREELANCE']),
  date: z.string().transform((str) => new Date(str)),
});

export class TransactionController {
  async create(req: Request, res: Response) {
    const { amount, description, type, category, date } = createTransactionSchema.parse(req.body);

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        description,
        type,
        category,
        date,
        userId: req.userId as string,
      },
    });

    return res.status(201).json(transaction);
  }

  async list(req: Request, res: Response) {
    const { month, year } = req.query;
    
    let dateFilter = {};
    if (month && year) {
      const monthNum = parseInt(month as string) - 1;
      const yearNum = parseInt(year as string);
      
      const startOfMonth = new Date(yearNum, monthNum, 1);
      const endOfMonth = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);
      
      dateFilter = {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        }
      };
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
        ...dateFilter,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return res.json(transactions);
  }

  async summary(req: Request, res: Response) {
    const { month, year } = req.query;
    
    let dateFilter = {};
    if (month && year) {
      const monthNum = parseInt(month as string) - 1;
      const yearNum = parseInt(year as string);
      
      const startOfMonth = new Date(yearNum, monthNum, 1);
      const endOfMonth = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);
      
      dateFilter = {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        }
      };
    }

    const totals = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId: req.userId,
        ...dateFilter,
      },
      _sum: {
        amount: true,
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    totals.forEach((t) => {
      if (t.type === 'INCOME') totalIncome = Number(t._sum.amount || 0);
      if (t.type === 'EXPENSE') totalExpense = Number(t._sum.amount || 0);
    });

    const balance = totalIncome - totalExpense;

    const expensesByCategory = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        type: 'EXPENSE',
        userId: req.userId,
        ...dateFilter,
      },
      _sum: {
        amount: true,
      },
    });

    const categorySummary = expensesByCategory.map((item) => ({
      category: item.category,
      total: Number(item._sum.amount),
    }));

    return res.json({
      totalIncome,
      totalExpense,
      balance,
      categorySummary,
    });
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;

    try {
      // Verifica se a transação existe e pertence ao usuário autenticado
      const transaction = await prisma.transaction.findUnique({
        where: { id }
      });

      if (!transaction || transaction.userId !== req.userId) {
        return res.status(404).json({ error: 'Transação não encontrada.' });
      }

      await prisma.transaction.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      return res.status(500).json({ error: 'Erro interno ao deletar a transação.' });
    }
  }
}
