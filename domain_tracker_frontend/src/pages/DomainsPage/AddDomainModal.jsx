import { useState } from "react";
import AddDomain from "../../components/AddDomain/AddDomain";
import { createDomain } from "../../services/domainService";

const AddDomainModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ domainName, expirationDate }) => {
    if (!domainName || !expirationDate) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);

    try {
      const response = await createDomain({
        domain_name: domainName,
        expiration_date: expirationDate.format("YYYY-MM-DD"),
      });

      console.log("Başarıyla eklendi:", response);

      // Başarılı olursa üst component'e callback gönder (opsiyonel)
      onSuccess?.(response);

      // Modalı kapat
      onClose();

      // Bildirim
      alert("Domain başarıyla eklendi ✅");
    } catch (error) {
      console.error("Hata:", error);
      alert(error.message || "Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddDomain
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
};

export default AddDomainModal;
