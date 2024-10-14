import { Claim, User } from '@prisma/client';

class MockPrismaClient {
  private claims: Claim[] = [];
  private users: User[] = [];

  claim = {
    create: async (data: any) => {
      const newClaim = { id: Date.now().toString(), ...data.data };
      this.claims.push(newClaim);
      return newClaim;
    },
    findFirst: async (query: any) => {
      return this.claims.find(claim => 
        claim.orderNumber === query.where.orderNumber && 
        claim.email === query.where.email
      );
    },
    findMany: async () => {
      return this.claims;
    },
    update: async (query: any) => {
      const index = this.claims.findIndex(claim => claim.id === query.where.id);
      if (index !== -1) {
        this.claims[index] = { ...this.claims[index], ...query.data };
        return this.claims[index];
      }
      throw new Error('Claim not found');
    },
  };

  user = {
    findUnique: async (query: any) => {
      return this.users.find(user => user.email === query.where.email);
    },
  };
}

const prisma = new MockPrismaClient();

export default prisma;