import { useSearchParams, useNavigate } from 'react-router-dom';


export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isSuccess = searchParams.get('payment') === 'success';
  const orderId = searchParams.get('orderId');

  return (
    <div>
      {isSuccess ? (
        <>
          <h1>✅ התשלום הצליח!</h1>
          <p>מספר הזמנה: {orderId}</p>
          <button onClick={() => navigate('/')}>חזור לדף הבית</button>
        </>
      ) : (
        <>
          <h1>❌ התשלום נכשל</h1>
          <button onClick={() => navigate('/checkout')}>נסה שוב</button>
        </>
      )}
    </div>
  );
}