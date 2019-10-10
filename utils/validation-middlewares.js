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
  ],
  updateValidation: [
    check('name', 'should be string 2 chars min')
      .isString()
      .trim()
      .isLength({ min: 2 })
      .optional(),
    check('email', 'should be valid email address')
      .isString()
      .trim()
      .isEmail()
      .normalizeEmail()
      .optional(),
    check('password', 'should be string 6 chars min')
      .isString()
      .trim()
      .not()
      .isEmpty()
      .optional()
  ],
  profileValidation: [
    check('status', 'status is required')
      .isString()
      .trim()
      .not()
      .isEmpty(),
    check('skills', 'skills is required')
      .isString()
      .trim()
      .not()
      .isEmpty(),
    check('company', 'should be not empty string if provided')
      .isString()
      .trim()
      .not()
      .isEmpty()
      .optional(),
    check('website', 'should be not empty string if provided')
      .isString()
      .trim()
      .not()
      .isEmpty()
      .optional(),
    check('location', 'should be not empty string if provided')
      .isString()
      .trim()
      .not()
      .isEmpty()
      .optional(),
    check('bio', 'should be not empty string if provided')
      .isString()
      .trim()
      .not()
      .isEmpty()
      .optional(),
    check('githubusername', 'should be not empty string if provided')
      .isString()
      .trim()
      .not()
      .isEmpty()
      .optional(),
    check('youtube', 'should be not empty string if provided')
      .isString()
      .trim()
      .not()
      .isEmpty()
      .optional(),
    check('twitter', 'should be not empty string if provided')
      .isString()
      .trim()
      .not()
      .isEmpty()
      .optional(),
    check('facebook', 'should be not empty string if provided')
      .isString()
      .trim()
      .not()
      .isEmpty()
      .optional(),
    check('linkedin', 'should be not empty string if provided')
      .isString()
      .trim()
      .not()
      .isEmpty()
      .optional(),
    check('instargam', 'should be not empty string if provided')
      .isString()
      .trim()
      .not()
      .isEmpty()
      .optional()
  ],
  profileUpdateValidation: [
    check(
      [
        'status',
        'skills',
        'company',
        'website',
        'location',
        'bio',
        'githubusername',
        'youtube',
        'twitter',
        'facebook',
        'linkedin',
        'instargam'
      ],
      'should be not empty string if provided'
    )
      .isString()
      .trim()
      .not()
      .isEmpty()
      .optional()
  ]
}
