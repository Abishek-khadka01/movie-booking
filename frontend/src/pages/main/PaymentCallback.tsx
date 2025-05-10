import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { VerifyPayment } from '../../services/paymentApis';
function PaymentCallback() {
  const { search } = useLocation(); // ?key=value&key2=value2
  const queryParams = new URLSearchParams(search);

  const pidx = queryParams.get("pidx");
  const transaction_id = queryParams.get("transaction_id");
  const tidx = queryParams.get("tidx");
  const txnId = queryParams.get("txnId");
  const amount = queryParams.get("amount");
  const total_amount = queryParams.get("total_amount");
  const mobile = queryParams.get("mobile");
  const status = queryParams.get("status");
  const purchase_order_id = queryParams.get("purchase_order_id");
  const purchase_order_name = queryParams.get("purchase_order_name");
  const navigate = useNavigate()


  const HandlePayment =async  ()=>{
    const result = await VerifyPayment(pidx as string , transaction_id as string  , purchase_order_id as string  , status as string )
    if(result.data.success){
      alert(result.data.message)
      navigate("/dashboard")
    }

  }

  useEffect(()=>{
      HandlePayment()
  }, [])


    
  return (
    <>
    </>
  );
}

export default PaymentCallback;
