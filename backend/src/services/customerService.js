// Customer Service
// Database operations for Customer model using Prisma

const prisma = require('../config/database');

class CustomerService {
  // Get all customers
  async getAllCustomers() {
    return await prisma.customer.findMany({
      orderBy: { id: 'asc' }
    });
  }

  // Get customer by ID
  async getCustomerById(id) {
    return await prisma.customer.findUnique({
      where: { id: parseInt(id) }
    });
  }

  // Create new customer
  async createCustomer(data) {
    return await prisma.customer.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address
      }
    });
  }

  // Update customer
  async updateCustomer(id, data) {
    return await prisma.customer.update({
      where: { id: parseInt(id) },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address
      }
    });
  }

  // Delete customer
  async deleteCustomer(id) {
    return await prisma.customer.delete({
      where: { id: parseInt(id) }
    });
  }
}

module.exports = new CustomerService();
