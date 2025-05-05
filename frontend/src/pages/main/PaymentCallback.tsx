import { useLocation } from 'react-router-dom';

function PaymentCallback() {

  const { search } = useLocation(); // gives you '?q=chatgpt&lang=en'
  const queryParams = new URLSearchParams(search);

  

  return (
    <div>
      {
        queryParams
      }
    </div>
  );
}




export default PaymentCallback