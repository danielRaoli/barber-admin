import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const barbers = [
  {
    name: "Carlos Silva",
    specialty: "Corte e Barba",
    rating: 4.8,
    appointments: 156,
  },
  {
    name: "André Santos",
    specialty: "Corte Moderno",
    rating: 4.9,
    appointments: 142,
  },
  // Adicione mais barbeiros aqui
];

export function BarbersList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Especialidade</TableHead>
          <TableHead>Avaliação</TableHead>
          <TableHead>Atendimentos</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {barbers.map((barber) => (
          <TableRow key={barber.name}>
            <TableCell>{barber.name}</TableCell>
            <TableCell>{barber.specialty}</TableCell>
            <TableCell>{barber.rating}</TableCell>
            <TableCell>{barber.appointments}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
