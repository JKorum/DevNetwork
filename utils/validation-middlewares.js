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
  ],
  experienceValidation: [
    check(['title', 'company'], 'should be not empty')
      .isString()
      .trim()
      .not()
      .isEmpty(),
    check(['location', 'description'], 'should be not empty if provided')
      .isString()
      .trim()
      .not()
      .isEmpty()
      .optional(),
    check('from', 'should be not empty')
      .not()
      .isEmpty(),
    check(['to', 'current'], 'should be not empty if provided')
      .not()
      .isEmpty()
      .optional()
  ],
  educationValidation: [
    check(['school', 'degree', 'fieldofstudy', 'from'], 'should be not empty')
      .isString()
      .trim()
      .not()
      .isEmpty(),
    check('to', 'current', 'description', 'should be not empty if provided')
      .isString()
      .trim()
      .not()
      .isEmpty()
      .optional()
  ],
  postAndCommentValidation: [
    check('text', 'should be not empty')
      .isString()
      .trim()
      .not()
      .isEmpty()
  ],
  imageValidation: [
    check('image', 'should be valid URL')
      .isString()
      .trim()
      .not()
      .isEmpty()
      .isURL()
  ]
}
