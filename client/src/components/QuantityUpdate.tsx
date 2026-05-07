import Button from "@mui/material/Button";
type Props = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

function QuantityUpdate({ quantity, onIncrease, onDecrease }: Props) {
  return (
    <>
      <Button onClick={onIncrease} className="updateQuantityBtn">+</Button>
      <span>{quantity}</span>
      <Button onClick={onDecrease} className="updateQuantityBtn">-</Button>
    </>
  );
}

export default QuantityUpdate;
