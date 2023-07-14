import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  withRouter,
  RouterProps,
  RouteComponentProps
} from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { AuthStatus, useAuth } from './hooks/useAuth';
import Products from './pages/Products';
import SecureLayout from './Layouts/SecureLayout';
import Loader from './components/Loader';
import GuessLayout from './Layouts/GuessLayout';

interface PrivateRouteProps extends RouteComponentProps {
  path: string;
  component: React.ComponentType<RouterProps>;
}

const PrivateR = ({ component: Component, ...rest }: PrivateRouteProps) => {
  const { status, loading, authenticate } = useAuth();

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  if (status === AuthStatus.Unknown || loading) return <Loader name="backdrop" />;

  return (
    <Route
      {...rest}
      render={(props) => {
        if (status === AuthStatus.Guess) return <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
        return (
          <SecureLayout>
            <Component {...props} />
          </SecureLayout>
        );
      }}
    />
  );
};

const PrivateRoute = withRouter(PrivateR);

export const MainRouter = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/signup">
          <GuessLayout>
            <SignUp />
          </GuessLayout>
        </Route>
        <Route exact path="/">
          <GuessLayout>
            <SignIn />
          </GuessLayout>
        </Route>
        <PrivateRoute path="/product" component={Products} />
      </Switch>
    </Router>
  );
};
