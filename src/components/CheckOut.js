import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { LoggedUserConsumer } from "../context/loggedUser";

function CheckOut() {
  const loggedInUser = useContext(LoggedUserConsumer);
  const [userCart, setUserCart] = useState({});
  const [userProducts, setUserProducts] = useState([]);

  const [stepOne, setStepOne] = useState(true);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [stepTwo, setStepTwo] = useState(false);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardSecureNumber, setCardSecureNumber] = useState("");
  const [cardType, setCardType] = useState("");
  

  const [stepThree, setStepThree] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);

  const history = useHistory();

  useEffect(() => {
    async function getUser() {
      const user = await axios.get(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/usercart`,
        { withCredentials: true }
      );
      setUserCart(user.data);
      setUserProducts(user.data.products);
      
      let userSubTotal = 0;
      user.data.products.map((product) => userSubTotal += product.purchasePrice);
      setSubTotal(userSubTotal.toFixed(2));
      setTotal(userSubTotal + user.data.deliveryFee);
    }
    getUser();
  }, []);


  const handleFinishPurchase = async () => {
    const order = {
      userProducts,
      schedule_delivery: {
        date,
        time,
      },
      total,
      address:{
        city,
        address,
        zipCode,
      },
      payment:{
        name,
        cardNumber,
        cardSecureNumber,
        cardType,
      },
    };

 
      await axios.put(`http://localhost:5000/orders`, order, {withCredentials: true});

      toast.success("Purchase Sucess!");
      history.push("/products");

  };



  if (stepOne && !stepTwo && !stepThree) {
    // first step is the list of items in the cart and the schedule of the delivery
    return (
      <div>
        <h4>Your Products</h4>
        <ul>
          {userCart &&
            userCart.products?.map((product) => {
              return (
                <li>
                  <h6>{product.item.name}</h6>
                  <p>{product.item.category}</p>
                </li>
              );
            })}
        </ul>
        <div>
          <h5>Schedule your delivery</h5>
          <form>
            <input type="date" onChange={(e) => setDate(e.target.value)} value={date} required/>
            <br />

            <input type="radio" id="morning" name="schedule" onChange={(e) => setTime(e.target.value)} checked={time === "Morning (8-12h)"} value="Morning (8-12h)" />
            <label for="morning">Morning (8-12h)</label>
            <br />

            <input type="radio" id="noon" name="schedule" onChange={(e) => setTime(e.target.value)} checked={time === "Noon (12-16h)"} value="Noon (12-16h)" />
            <label for="noon">Noon (12-16h)</label>
            <br />

            <input type="radio" id="evening" name="schedule" onChange={(e) => setTime(e.target.value)} checked={time === "Evening (16-20h)"} value="Evening (16-20h)" />
            <label for="evening">Evening (16-20h)</label>
            <br />
          </form>
        </div>
        <button
          onClick={() => {
            setStepOne(false);
            setStepTwo(true);
          }}
        >
          Next step
        </button>
      </div>
    );
  } else if (!stepOne && stepTwo && !stepThree) {
    // second step is the address in the payment method of the delivery
    return (
      <div>
        <div>
          <h5>Your Address</h5>
          <form>
            <label>City</label>
            <input type="text" onChange={(e) => setCity(e.target.value)} value={city} required/>

            <label>Adress</label>
            <input type="text" onChange={(e) => setAddress(e.target.value)} value={address} required/>

            <label>Zip Code</label>
            <input type="text" placeholder="0000-000" onChange={(e) => setZipCode(e.target.value)} value={zipCode} required/>
          </form>
        </div>
        <div>
            <h5>Payment method</h5>
            <form>
                <label>Name</label>
                <input type="text" onChange={(e) => setName(e.target.value)} value={name}  required/>

                <label>Card Number</label>
                <input type="number"  onChange={(e) => setCardNumber(e.target.value)} value={cardNumber} required/>

                <label>Security Card Number</label>
                <input type="number" placeholder="000" onChange={(e) => setCardSecureNumber(e.target.value)} value={cardSecureNumber} required/>

                <div>
                    <img  alt="MasterCard" />
                    <input type="radio" id="masterCard" name="cardType" onChange={(e) => setCardType(e.target.value)} checked={cardType === "MasterCard"} value="MasterCard" />
                </div>
                <div>
                    <img  alt="VISA" />
                    <input type="radio" id="visa" name="cardType" onChange={(e) => setCardType(e.target.value)} checked={cardType === "VISA"} value="VISA" />
                </div>
                <div>
                    <img  alt="AmericanExpress" />
                    <input type="radio" id="americanExpress" name="cardType" onChange={(e) => setCardType(e.target.value)} checked={cardType === "AmericanExpress"} value="AmericanExpress" />
                </div>
            </form>
        </div>
        <button
          onClick={() => {
            setStepOne(true);
            setStepTwo(false);
            
          }}
        >
          Go back
        </button>
        <button
          onClick={() => {
            setStepTwo(false);
            setStepThree(true);
          }}
        >
          Next step
        </button>
      </div>
    );
  }
  else if(!stepOne && !stepTwo && stepThree){
    // third step is the list of all the information of the delivery and finalize the purchase
      return (
        <div>
            <div>
                <h4>Products</h4>
                <ul>
                {userCart &&
                    userCart.products?.map((product) => {
                    return (
                        <li>
                        <h6>{product.item.name}</h6>
                        <p>{product.item.category}</p>
                        <p>{product.item.price}€</p>
                        </li>
                    );
                    })}
                </ul>
            </div>
            <div>
                <h4>Delivery Address</h4>
                <p>{city}</p>
                <p>{address}</p>
                <p>{zipCode}</p>
            </div>
            <div>
                <h4>Payment</h4>
                <p>{name}</p>
                <p>{cardNumber}</p>
                <p>{cardType}</p>
            </div>
            <h5>SubTotal: {subTotal}€</h5>
            <h6>DeliveryFee: {userCart.deliveryFee}€</h6>
            <h4>Total: {total.toFixed(2)}€</h4>
            <button onClick={() => {
                setStepTwo(true);
                setStepThree(false);
            }}>Go Back</button>
            <button onClick={handleFinishPurchase}>Finalize purchase</button>
        </div>
      );
  }
}

export default CheckOut;
