declare global {
  namespace App {
    interface Locals {
      user: { id: number; email: string; name: string; role: string } | null;
    }
  }
}

export {};
