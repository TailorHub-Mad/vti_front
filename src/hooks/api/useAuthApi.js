import AuthService from '../../services/auth.service';
import useApiError from '../useApiError';

const useAuthApi = () => {
  const { addError, removeError } = useApiError();
  const authService = new AuthService(addError, removeError);
  const health = (data) => authService.health(data);
  return { health };
};

export default useAuthApi;
