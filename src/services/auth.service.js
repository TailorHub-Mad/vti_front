import ServiceConstructor from '.';

class AuthService extends ServiceConstructor {
  health = () => this.makeRequest(this.instance.get('/health'));
}

export default AuthService;
