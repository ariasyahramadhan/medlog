import { useState,useEffect } from "react";
import { Navigate } from "react-router-dom";
import { BrowserRouter  as Router, Routes, Route} from "react-router-dom"; 
import ClassCustomerList from "../ClassCustomerList";
import FunctionalCustomerList from "../FunctionalCustomerList";
import "./App.css";
import Sidebar from "./component/Sidebar";
import Header from "./component/Header";
import Dashboard from "./component/Dashboard";
import Products from "./pages/Products";
import Users from "./pages/Users";
import ProductsDetail from "./pages/ProductsDetail";
import UserSettings from "./pages/UserSettings";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import KelasSaya from "./pages/KelasSaya";
import Jadwal from "./pages/Jadwal";

function App() {
  const [count, setCount] = useState(15);
  const [title, setName] = useState("Vite + React");

  //Variabel let
  let angka = 10;
  angka = 20;
  console.log(angka);

  //variabel const
  const pi = 3.14;
  //pi=3.14
  console.log(pi);

  let x = 10;
  if (true) {
    let x = 20;
    console.log(x);
  }
  console.log(x);

  //Arrow Function
  const customers = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ];
  customers.forEach((customer) =>
    console.log(`${customer.name}-${customer.email}`)
  );

  //Destructing dalam pelanggan
  const customer = { id: 1, name: "John Doe", email: "john@example.com" };

  //menggunakan destructing
  const { name, email } = customer;
  console.log(`Pelanggan: ${name}, Email: ${email}`);

  // Spread Operator(...) dalam produk
  const products = [
    { id: 1, name: "Laptop", stock: 10 },
    { id: 2, name: "Smartphone", stock: 15 },
  ];

  const newProduct = { id: 3, name: "Tablet", stock: 8 };

  const updatesProducts = [...products, newProduct];
  console.log(updatesProducts);

  //Default parameters dalam order
  const createOrder = (
    customerName = "Guest",
    product = "Uknown",
    quantity = 1
  ) => {
    console.log(`Pesanan: ${customerName} membeli ${quantity} unit ${product}`);
  };

  //Tanpa memberikakn semua parameter
  createOrder("John Doe", "Laptop", 2);
  createOrder("Jane Smith", "Smartphone"); //default quantity =1
  createOrder(); //semua menggunakan default

  //Template literals dalam invoice(``)
  const invoice = (customer, product, quantity, price) => {
    return `
  =================
      INVOICE
  =================
  Nama Pelanggan : ${customer}
  Produk : ${product}
  Jumlah : ${quantity}
  Harga Satuan : $${price}
  Total Bayar : $${quantity * price}
  =================
  `;
  };

  console.log(invoice("John Doe", " Laptop", 2, 500));

  //Promise unutk Simulasi api
  const getCustomers = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(["John Doe", "Jane Smith", "Robert Brown"]);
      }, 2000); // Simulasi delay 2 detik
    });
  };

  getCustomers().then((customers) => console.log("Pelanggan:", customers));

  //Async/ Await
  const fetchProducts = async () => {
    try {
      let response = await fetch("https://fakestoreapi.com/products");
      let data = await response.json();
      console.log("Daftar Produk:", data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  fetchProducts();

  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />
  
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />
  
          {/* Routing */}
          <div className="p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jadwal" element={<Jadwal />} />
            <Route path="/kelassaya" element={<KelasSaya />} />
            <Route path="/users" element={<Users />} >
                <Route path="profile" element={<UserProfile/>} />
                <Route path="settings" element={<UserSettings/>} />
            </Route>
            <Route path="/products/:id" element={<ProductsDetail/>} />
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Error />} />
            <Route path="/error" element={<Navigate to="/error" />} />

          
          </Routes>
  
          {/* Jangan pakai tag div yang dikomentari separuh */}
          {/* <div className="p-4">
              Dashboard (Menampilkan Ringkasan data)
              <Dashboard />
          </div> */}
        </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
