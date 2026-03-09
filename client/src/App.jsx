import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import InputDataPengajuan from './pages/InputDataPengajuan';
import ListDataPengajuan from './pages/ListDataPengajuan';
import Prakarsa from './pages/Prakarsa';
import AkadDigital from './pages/AkadDigital';
import AkadDanPencairan from './pages/AkadDanPencairan';
import AdminPengajuan from './pages/AdminPengajuan';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/input-data-pengajuan" element={<InputDataPengajuan />} />
        <Route path="/list-data-pengajuan" element={<ListDataPengajuan />} />
        <Route path="/prakarsa/:id" element={<Prakarsa />} />
        <Route path="/akad-digital/:id" element={<AkadDigital />} />
        <Route path="/akad-dan-pencairan" element={<AkadDanPencairan />} />
        <Route path="/admin" element={<AdminPengajuan />} />
      </Routes>
    </BrowserRouter>
  );
}
