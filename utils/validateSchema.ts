import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import userSchema from '../schemas/user.schema.json';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Add user schema to validator
ajv.addSchema(userSchema, 'user');

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateUser(data: any): ValidationResult {
  const validate = ajv.getSchema('user');
  const isValid = validate!(data);

  return {
    isValid: !!isValid,
    errors: !isValid ? (validate!.errors?.map(error => 
      `${error.instancePath} ${error.message}`
    ) || []) : []
  };
}

export default validateUser;