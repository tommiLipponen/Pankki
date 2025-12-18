// Customer Controller
// Business logic for customer operations

const customerService = require('../services/customerService');

class CustomerController {
  // GET /api/customers
  async getAllCustomers(req, res, next) {
    try {
      const customers = await customerService.getAllCustomers();
      res.json({
        success: true,
        data: customers,
        count: customers.length
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/customers/:id
  async getCustomerById(req, res, next) {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/customers
  async createCustomer(req, res, next) {
    try {
      const { firstName, lastName, address } = req.body;

      // Basic validation
      if (!firstName || !lastName || !address) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: firstName, lastName, address'
        });
      }

      const customer = await customerService.createCustomer(req.body);
      
      res.status(201).json({
        success: true,
        data: customer,
        message: 'Customer created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/customers/:id
  async updateCustomer(req, res, next) {
    try {
      const { firstName, lastName, address } = req.body;

      // Basic validation
      if (!firstName || !lastName || !address) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: firstName, lastName, address'
        });
      }

      const customer = await customerService.updateCustomer(req.params.id, req.body);
      
      res.json({
        success: true,
        data: customer,
        message: 'Customer updated successfully'
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }
      next(error);
    }
  }

  // DELETE /api/customers/:id
  async deleteCustomer(req, res, next) {
    try {
      await customerService.deleteCustomer(req.params.id);
      
      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }
      next(error);
    }
  }
}

module.exports = new CustomerController();
