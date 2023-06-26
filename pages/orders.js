import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      const sortedOrders = response.data.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA; // Sort in descending order
      });
      setOrders(sortedOrders);
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
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="slim">
          {orders.length > 0 && orders.map(order => {
            const paid = order.transactionID != '' && order.transactionID != null && order.transactionID != undefined
            return (
              <tr key={order._id} className="border-b-2">
                <td>{(new Date(order.createdAt)).toLocaleString()}
                </td>
                <td>
                  {order.name} <br />
                  {order.email}<br />
                  {order.address} <br />
                  {numberWithCommas(order.cost)}₫<br />
                  <span className={paid ? 'text-green-600' : 'text-red-600'}>{paid ? `Paid :${order.transactionID}` : 'Not paid'}</span>
                </td>
                <td>
                  {order.order.map(l => (
                    <>
                      {l.title} x
                      {l.quantity}<br />
                    </>
                  ))}
                </td>
                <td>Pending</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {orders.length == 0 &&
        <div className="flex mt-6 w-full justify-center">
          <Spinner />
        </div>
      }
    </Layout>
  );
}