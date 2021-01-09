import { useSession } from "@inrupt/solid-ui-react/dist";
import { MudAccountProvider } from "../lib/context/mudAccountContext";
import LoginForm from "../components/loginForm";
import GameWindow from "../components/gameWindow";

export default function Home(): React.ReactElement {
  const { session } = useSession();
  const { webId } = session.info;

  if (!session.info.isLoggedIn) {
    return <LoginForm />;
  }

  return (
    <MudAccountProvider webId={webId}>
      <GameWindow />
    </MudAccountProvider>
    );
}
