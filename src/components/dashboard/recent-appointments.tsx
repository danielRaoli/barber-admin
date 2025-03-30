export function RecentAppointments() {
  const appointments = [
    {
      client: "João Silva",
      service: "Corte + Barba",
      time: "14:00",
      barber: "Carlos",
    },
    {
      client: "Pedro Santos",
      service: "Corte",
      time: "15:00",
      barber: "André",
    },
    // Adicione mais agendamentos aqui
  ];

  return (
    <div className="space-y-4">
      {appointments.map((appointment, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b pb-2"
        >
          <div>
            <p className="font-medium">{appointment.client}</p>
            <p className="text-sm text-muted-foreground">
              {appointment.service} com {appointment.barber}
            </p>
          </div>
          <div className="text-sm">{appointment.time}</div>
        </div>
      ))}
    </div>
  );
}
