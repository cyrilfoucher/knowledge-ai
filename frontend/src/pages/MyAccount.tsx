import PageHeader from "../layouts/PageHeader";
import ProfileForm from "../components/account/ProfileForm";
import PasswordForm from "../components/account/PasswordForm";

function MyAccount() {
  return (
    <>
      <PageHeader title="Mon compte" subtitle="Mes informations" />
      <div className="flex max-w-2xl flex-col gap-6">
        <ProfileForm />
        <PasswordForm />
      </div>
    </>
  );
}

export default MyAccount;
