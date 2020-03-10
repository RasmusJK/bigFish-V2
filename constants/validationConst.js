const registerConstraints = {
  username: {
    presence: {
      message: 'cannot be blank.',
    },
    length: {
      minimum: 3,
      message: 'must be at least 3 characters',
    },
  },
  email: {
    presence: {
      message: 'cannot be blank.',
    },
    email: {
      message: 'not valid.',
    },
  },
  full_name: {
    presence: 'cannot be blank.',
  },
  password: {
    presence: {
      message: 'cannot be blank.',
    },
    length: {
      minimum: 5,
      message: 'must be at least 5 characters',
    },
  },
  confirmPassword: {
    presence: 'cannot be blank.',
    equality: {
      attribute: 'password',
    },
  },
};

const uploadConstraints = {
  title: {
    presence: {
      message: 'cannot be blank.',
    },
    length: {
      minimum: 3,
      message: 'must be at least 3 characters',
    },
  },
  description: {
    format: {
      pattern: '^(.{3,})?$',
      flags: 'i',
      message: 'must be at least 3 characters',
    },
  },
};

const commentConstraints = {
  comment: {
    presence: {
      message: 'cannot be blank',
    },
    length:{
      minimum: 1,
      message: 'cannot be blank',
    }
  },
};

export {registerConstraints, uploadConstraints, commentConstraints};
