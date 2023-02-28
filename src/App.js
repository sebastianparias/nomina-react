import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";

const dias = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
];

const formularioInicial = {};
for (let i = 1; i <= 31; i++) {
  formularioInicial[`entradaDia${i}`] = "";
  formularioInicial[`salidaDia${i}`] = "";
}

function App() {
  const [jornadaLaboral, setJornadaLaboral] = useState(9);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [horasExtraState, setHorasExtraState] = useState(0);
  const [horasRecargoNocturnoState, setHorasRecargoNocturnoState] = useState(0);
  const [horasTotalesState, setHorasTotalesState] = useState(0);

  const editarFormulario = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const darFormatoFecha = (hora, nuevoDia = 0) => {
    const horaString = nuevoDia ? "1970-01-02 " + hora : "1970-01-01 " + hora;
    return new Date(horaString);
  };

  const calcHorasExtra = (entradaMilisegundos, salidaMilisegundos) => {
    let totalMilisegundos;
    if (salidaMilisegundos < entradaMilisegundos) {
      totalMilisegundos = salidaMilisegundos - entradaMilisegundos;
      totalMilisegundos = totalMilisegundos + 86400000;
    } else {
      totalMilisegundos = salidaMilisegundos - entradaMilisegundos;
    }
    const totalHoras = totalMilisegundos / 1000 / 3600;
    return totalHoras > jornadaLaboral ? totalHoras - jornadaLaboral : 0;
  };

  const calcHorasTotales = (entradaEnMilisegundos, salidaEnMilisegundos) => {
    let total;
    if (salidaEnMilisegundos > entradaEnMilisegundos) {
      total = (salidaEnMilisegundos - entradaEnMilisegundos) / 1000 / 3600;
    } else {
      total = (salidaEnMilisegundos - entradaEnMilisegundos) / 1000 / 3600;
      if (total < 0) total += 24;
    }
    return total;
  };

  const calcRecargoNocturno = (
    entradaString,
    salidaString,
    entradaMilisegundos,
    salidaMilisegundos
  ) => {
    let fechaEntrada = darFormatoFecha(entradaString);
    let fechaSalida =
      entradaMilisegundos > salidaMilisegundos
        ? darFormatoFecha(salidaString, 1)
        : darFormatoFecha(salidaString, 0);

    if (
      fechaEntrada < inicioRecargoNocturno &&
      fechaSalida < inicioRecargoNocturno
    ) {
      fechaEntrada = darFormatoFecha(entradaString, 1);
      fechaSalida = darFormatoFecha(salidaString, 1);
    }

    if (
      fechaEntrada <= finRecargoNocturno &&
      inicioRecargoNocturno <= fechaSalida
    ) {
      const latestStart = Math.max(fechaEntrada, inicioRecargoNocturno);
      const earliestEnd = Math.min(fechaSalida, finRecargoNocturno);
      const delta = earliestEnd - latestStart;
      return delta / 1000 / 3600;
    } else {
      return 0;
    }
  };

  const calcularHoras = () => {
    let horasExtras = 0;
    let horasRecargoNocturno = 0;
    let horasTotales = 0;

    for (let i = 1; i <= dias.length; i++) {
      const entradaMilisegundos = darFormatoFecha(formulario[`entradaDia${i}`]);
      const salidaMilisegundos = darFormatoFecha(formulario[`salidaDia${i}`]);

      horasExtras += calcHorasExtra(entradaMilisegundos, salidaMilisegundos);

      horasRecargoNocturno += calcRecargoNocturno(
        formulario[`entradaDia${i}`],
        formulario[`salidaDia${i}`],
        entradaMilisegundos,
        salidaMilisegundos
      );

      horasTotales += calcHorasTotales(entradaMilisegundos, salidaMilisegundos);
    }
    setHorasRecargoNocturnoState(horasRecargoNocturno);
    setHorasExtraState(horasExtras);
    setHorasTotalesState(horasTotales);
  };

  const inicioRecargoNocturno = darFormatoFecha("21:00", 0);
  const finRecargoNocturno = darFormatoFecha("06:00", 1);

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col">
          <h1>Calculadora de recargo nocturno y horas extras</h1>

          <label className="form-label" htmlFor="jornadaLaboral">
            Jornada laboral en horas:{" "}
          </label>
          <input
            className="form-control"
            type="number"
            id="jornadaLaboral"
            name="jornadaLaboral"
            value={jornadaLaboral}
            onChange={(e) => setJornadaLaboral(e.target.value)}
          />
        </div>
      </div>

      <div className="row my-5">
        <div className="col-8 border p-3">
          {dias.map((dia, index) => {
            return (
              <div className="row mt-3" key={index}>
                <p>Dia {dia}</p>
                <div className="col">
                  <label className="form-label" htmlFor={`entradaDia${dia}`}>
                    Hora entrada:{" "}
                  </label>
                  <input
                    className="form-control"
                    type="time"
                    name={`entradaDia${dia}`}
                    id={`entradaDia${dia}`}
                    onChange={editarFormulario}
                  />
                </div>
                <div className="col">
                  <label htmlFor={`salidaDia${dia}`} className="form-label">
                    Hora salida:{" "}
                  </label>
                  <input
                    className="form-control"
                    type="time"
                    name={`salidaDia${dia}`}
                    id={`salidaDia${dia}`}
                    onChange={editarFormulario}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="col-4">
          <button onClick={calcularHoras} className="btn btn-success">
            Calcular horas
          </button>

          <h4>
            El total de horas extras fueron{" "}
            <span className="text-warning">{horasExtraState}</span>
          </h4>
          <h4>
            El total de horas con recargo nocturno fueron{" "}
            <span className="text-warning">{horasRecargoNocturnoState}</span>
          </h4>

          <h4>
            El total de horas fueron{" "}
            <span className="text-warning">{horasTotalesState}</span>
          </h4>
        </div>
      </div>
    </div>
  );
}

export default App;
