import { useContext } from 'react';
import { ApiErrorContext } from '../provider/ApiErrorProvider';

function useApiError() {
  const { error, addError, removeError } = useContext(ApiErrorContext);
  return { error, addError, removeError };
}

export default useApiError;
