import { useEffect, useState } from "react";
import { Location } from "history";
import { useLocation } from "react-router-dom";
import { Button, Icon } from "react-bulma-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faGoogle,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const loginGitHub = (location: Location) => () => {
  window.sessionStorage.setItem("redirect", location.pathname);
  window.location.replace(`${process.env.REACT_APP_API_ROOT}/v1/login/github`);
};

const loginGoogle = (location: Location) => () => {
  window.sessionStorage.setItem("redirect", location.pathname);
  window.location.replace(`${process.env.REACT_APP_API_ROOT}/v1/login/google`);
};

const loginTwitter = (location: Location) => () => {
  window.sessionStorage.setItem("redirect", location.pathname);
  window.location.replace(`${process.env.REACT_APP_API_ROOT}/v1/login/twitter`);
};

const logoutAll = (location: Location) => () => {
  window.sessionStorage.setItem("redirect", location.pathname);
  window.location.replace(`${process.env.REACT_APP_API_ROOT}/v1/logout`);
};

interface LoginStatusState {
  error: Error | null;
  isLoaded: boolean;
  value: {
    github: ProviderStatus | null;
    google: ProviderStatus | null;
    twitter: ProviderStatus | null;
  };
}

interface ProviderStatus {
  id: string;
  name: string;
  access: Array<string>;
}

export function LoginStatus() {
  const [state, setState] = useState<LoginStatusState>({
    error: null,
    isLoaded: false,
    value: { github: null, google: null, twitter: null },
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ROOT}/v1/login/status`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setState({
            error: null,
            isLoaded: true,
            value: result,
          });
        },
        (error) => {
          setState({
            isLoaded: true,
            error,
            value: { github: null, google: null, twitter: null },
          });
        }
      );
  }, []);

  const {
    error,
    isLoaded,
    value: { github, google, twitter },
  } = state;

  let github_button;
  let google_button;
  let twitter_button;

  let any_logged_in = github !== null || google !== null || twitter !== null;
  let location = useLocation();

  if (github) {
    let color = github.access.includes("trusted") ? "success" : "warning";

    github_button = (
      <Button color={color} unselectable>
        <Icon>
          <FontAwesomeIcon icon={faGithub} />
        </Icon>
        <span>{github!.name}</span>
      </Button>
    );
  } else {
    github_button = (
      <Button color="light" onClick={loginGitHub(location)}>
        <Icon>
          <FontAwesomeIcon icon={faGithub} />
        </Icon>
        <span>Sign in with GitHub</span>
      </Button>
    );
  }

  if (google) {
    let color = google.access.includes("trusted") ? "success" : "warning";

    google_button = (
      <Button color={color} unselectable>
        <Icon>
          <FontAwesomeIcon icon={faGoogle} />
        </Icon>
        <span>{google!.name}</span>
      </Button>
    );
  } else {
    google_button = (
      <Button color="light" onClick={loginGoogle(location)}>
        <Icon>
          <FontAwesomeIcon icon={faGoogle} />
        </Icon>
        <span>Sign in with Google</span>
      </Button>
    );
  }

  if (twitter) {
    let color = twitter.access.includes("trusted") ? "success" : "warning";

    twitter_button = (
      <Button color={color} unselectable>
        <Icon>
          <FontAwesomeIcon icon={faTwitter} />
        </Icon>
        <span>{twitter!.name}</span>
      </Button>
    );
  } else {
    twitter_button = (
      <Button color="light" onClick={loginTwitter(location)}>
        <Icon>
          <FontAwesomeIcon icon={faTwitter} />
        </Icon>
        <span>Sign in with Twitter</span>
      </Button>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <Button.Group>
        {github_button}
        {google_button}
        {twitter_button}
        {any_logged_in && (
          <Button
            color="danger"
            colorVariant="light"
            onClick={logoutAll(location)}
          >
            <Icon>
              <FontAwesomeIcon icon={faSignOut} />
            </Icon>
            <span>Sign out</span>
          </Button>
        )}
      </Button.Group>
    );
  } else {
    return (
      <Button.Group>
        {github_button}
        {google_button}
        {twitter_button}
        {any_logged_in && (
          <Button
            color="danger"
            colorVariant="light"
            onClick={logoutAll(location)}
          >
            <Icon>
              <FontAwesomeIcon icon={faSignOut} />
            </Icon>
            <span>Sign out</span>
          </Button>
        )}
      </Button.Group>
    );
  }
}
