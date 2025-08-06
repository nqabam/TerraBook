import RegistrationForm from "@/components/RegistrationForm";
import BottomNavigation from "@/components/BottomNavigation";

const Registration = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <RegistrationForm />
      <BottomNavigation />
    </div>
  );
};

export default Registration;