'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/inventory-ease-db';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/inventory-ease-db-test';
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
exports.PORT = process.env.PORT || 8080;
