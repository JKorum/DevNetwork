const { check } = require('express-validator')

module.exports = {
  registerValidation: [
    check('name', 'should be string 2 chars min')
      .isString()
      .trim()
      .isLength({ min: 2 }),
    check('email', 'should be valid email address')
      .isString()
      .trim()
      .isEmail()
      .normalizeEmail(),
    check('password', 'should be string 6 chars min')
      .isString()
      .trim()
      .not()
      .isEmpty()
  ],
  loginValidation: [
    check('email', 'should be valid email address')
      .isString()
      .trim()
      .isEmail()
      .normalizeEmail(),
    check('password', 'should be string 6 chars min')
      .isString()
      .trim()
      .not()
      .isEmpty()
  ]
}
