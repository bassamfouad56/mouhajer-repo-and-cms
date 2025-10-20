import SupplierForm from "./SupplierForm";
import EnquiryForm from "./EnquiryForm";

type Props = { supply?: boolean };

const ContactForm = ({ supply }: Props) => {
  if (supply) {
    return <SupplierForm />;
  }
  return <EnquiryForm />;
};

export default ContactForm;
