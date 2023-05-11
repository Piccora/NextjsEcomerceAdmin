import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders,setOrders] = useState([]);
  useEffect(() => {
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
    });
  }, []);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr className="border-b-2">
            <th>Date</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
        {orders.length > 0 && orders.map(order => {
        return(
          <tr key={order._id} className="border-b-2">
            <td>{(new Date(order.createdAt)).toLocaleString()}
            </td>
            <td>
              {order.name} <br />
              {order.email}<br />
              {order.address} <br />
              <span className={order.paid ? 'text-green-600' : 'text-red-600'}>{order.paid ? 'Paid' : 'Not paid'}</span>
            </td>
            <td>
              {order.order.map(l => (
                <>
                  {l.title} x
                  {l.quantity}<br />
                </>
              ))}
            </td>
          </tr>
        )})}
        </tbody>
      </table>
    </Layout>
  );
}