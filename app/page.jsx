'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [form, setForm] = useState({
    id: null,
    nama_pengguna: '',
    alamat: '',
    kategori: '',
    tipe: '',
    tanggal: ''
  })
  const [message, setMessage] = useState('')
  const [dataPengguna, setDataPengguna] = useState([])
  const [loading, setLoading] = useState(false)

  // Pagination state
  const [page, setPage] = useState(1)
  const limit = 5

  // Fetch data dengan pagination
  const fetchData = async (page = 1) => {
    setLoading(true)
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error } = await supabase
      .from('data_pengguna')
      .select('*', { count: 'exact' })
      .order('id', { ascending: true })
      .range(from, to)

    if (error) {
      setMessage('❌ Gagal mengambil data: ' + error.message)
      setDataPengguna([])
    } else {
      setDataPengguna(data)
      setMessage('')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData(page)
  }, [page])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (form.id === null) {
      // Insert data baru
      const { error } = await supabase
        .from('data_pengguna')
        .insert([{
          nama_pengguna: form.nama_pengguna,
          alamat: form.alamat,
          kategori: form.kategori,
          tipe: form.tipe,
          tanggal: form.tanggal
        }])
      if (error) {
        setMessage('❌ Gagal menambahkan data: ' + error.message)
      } else {
        setMessage('✅ Data berhasil ditambahkan!')
        setForm({
          id: null,
          nama_pengguna: '',
          alamat: '',
          kategori: '',
          tipe: '',
          tanggal: ''
        })
        fetchData(page)
      }
    } else {
      // Update data
      const { error } = await supabase
        .from('data_pengguna')
        .update({
          nama_pengguna: form.nama_pengguna,
          alamat: form.alamat,
          kategori: form.kategori,
          tipe: form.tipe,
          tanggal: form.tanggal
        })
        .eq('id', form.id)
      if (error) {
        setMessage('❌ Gagal mengupdate data: ' + error.message)
      } else {
        setMessage('✅ Data berhasil diupdate!')
        setForm({
          id: null,
          nama_pengguna: '',
          alamat: '',
          kategori: '',
          tipe: '',
          tanggal: ''
        })
        fetchData(page)
      }
    }
  }

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      nama_pengguna: item.nama_pengguna,
      alamat: item.alamat,
      kategori: item.kategori,
      tipe: item.tipe,
      tanggal: item.tanggal ? item.tanggal.slice(0, 10) : ''
    })
    setMessage('')
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return
    const { error } = await supabase
      .from('data_pengguna')
      .delete()
      .eq('id', id)
    if (error) {
      setMessage('❌ Gagal menghapus data: ' + error.message)
    } else {
      setMessage('✅ Data berhasil dihapus!')
      if (form.id === id) {
        setForm({
          id: null,
          nama_pengguna: '',
          alamat: '',
          kategori: '',
          tipe: '',
          tanggal: ''
        })
      }
      fetchData(page)
    }
  }

  const handleCancelEdit = () => {
    setForm({
      id: null,
      nama_pengguna: '',
      alamat: '',
      kategori: '',
      tipe: '',
      tanggal: ''
    })
    setMessage('')
  }

  return (
    <div className="max-w-xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center">Form Tambah Data Pengguna</h1>

      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md mb-6 space-y-4">
        <input
          type="text"
          name="nama_pengguna"
          placeholder="Nama Pengguna"
          value={form.nama_pengguna}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="text"
          name="alamat"
          placeholder="Alamat"
          value={form.alamat}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <select
          name="kategori"
          value={form.kategori}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="" disabled>-- Pilih Kategori --</option>
          <option value="Perorangan">Perorangan</option>
          <option value="Pedagang">Pedagang</option>
        </select>

        <select
          name="tipe"
          value={form.tipe}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="" disabled>-- Pilih Tipe --</option>
          <option value="Nonreferal">Nonreferal</option>
          <option value="Referal">Referal</option>
        </select>

        <input
          type="date"
          name="tanggal"
          placeholder="Tanggal"
          value={form.tanggal}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
          >
            {form.id === null ? 'Simpan' : 'Update'}
          </button>
          {form.id !== null && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex-1 bg-red-600 text-white py-3 rounded hover:bg-red-700 transition"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-4">Daftar Data Pengguna</h2>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Nama</th>
                <th className="border border-gray-300 p-2 text-left">Alamat</th>
                <th className="border border-gray-300 p-2 text-left">Kategori</th>
                <th className="border border-gray-300 p-2 text-left">Tipe</th>
                <th className="border border-gray-300 p-2 text-left">Tanggal</th>
                <th className="border border-gray-300 p-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataPengguna.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4">Belum ada data</td>
                </tr>
              ) : (
                dataPengguna.map(item => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{item.nama_pengguna}</td>
                    <td className="border border-gray-300 p-2">{item.alamat}</td>
                    <td className="border border-gray-300 p-2">{item.kategori}</td>
                    <td className="border border-gray-300 p-2">{item.tipe}</td>
                    <td className="border border-gray-300 p-2">{item.tanggal ? item.tanggal.slice(0, 10) : ''}</td>
                    <td className="border border-gray-300 p-2 space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-white"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={() => setPage(old => Math.max(old - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
        >
          Prev
        </button>
        <span className="flex items-center">Page {page}</span>
        <button
          onClick={() => setPage(old => old + 1)}
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          Next
        </button>
      </div>

      {message && (
        <p className={`mt-4 text-center ${message.startsWith('❌') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
