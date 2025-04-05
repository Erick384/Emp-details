import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Button } from "./ui/button/button";

interface Employee {
  id: number;
  name: string;
  email: string;
}

interface EmployeeForm {
  name: string;
  email: string;
}

export default function EmployeeApp() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState<EmployeeForm>({ name: "", email: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchEmployees = async () => {
    const res = await axios.get<Employee[]>("http://localhost:8080/api/employees");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      await axios.put(`http://localhost:8080/api/employees/${editingId}`, formData);
      setEditingId(null);
    } else {
      await axios.post("http://localhost:8080/api/employees", formData);
    }
    setFormData({ name: "", email: "" });
    fetchEmployees();
  };

  const handleEdit = (employee: Employee) => {
    setFormData({ name: employee.name, email: employee.email });
    setEditingId(employee.id);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:8080/api/employees/${id}`);
    fetchEmployees();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Employee Management</h1>
      <form onSubmit={handleSubmit} className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="border rounded p-2"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border rounded p-2"
          required
        />
        <Button type="submit" className="w-full">
          {editingId ? "Update" : "Add"} Employee
        </Button>
      </form>
      <div className="grid gap-4">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{emp.name}</p>
              <p className="text-sm text-gray-500">{emp.email}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleEdit(emp)}>Edit</Button>
              <Button onClick={() => handleDelete(emp.id)} variant="destructive">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}