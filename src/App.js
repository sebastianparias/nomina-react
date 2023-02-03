import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";

// to-do: components

// import { DateTime } from "luxon";

// const dt = new DateTime("12:01");
// const dt2 = new DateTime("12:02");
// console.log(dt)
// console.log(dt2)

const dias = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const formularioInicial = {
  entradaDia1: "",
  salidaDia1: "",
  entradaDia2: "",
  salidaDia2: "",
  entradaDia3: "",
  salidaDia3: "",
  entradaDia4: "",
  salidaDia4: "",
  entradaDia5: "",
  salidaDia5: "",
  entradaDia6: "",
  salidaDia6: "",
  entradaDia7: "",
  salidaDia7: "",
  entradaDia8: "",
  salidaDia8: "",
  entradaDia9: "",
  salidaDia9: "",
  entradaDia10: "",
  salidaDia10: "",
  entradaDia11: "",
  salidaDia11: "",
  entradaDia12: "",
  salidaDia12: "",
  entradaDia13: "",
  salidaDia13: "",
  entradaDia14: "",
  salidaDia14: "",
  entradaDia15: "",
  salidaDia15: "",
};

function App() {
  // const [inicioRecargo, setInicioRecargo] = useState("");
  // const [finRecargo, setFinRecargo] = useState("");
  const [jornadaLaboral, setJornadaLaboral] = useState(9);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [horasExtraState, setHorasExtraState] = useState(0);
  const [horasRecargoNocturnoState, setHorasRecargoNocturnoState] = useState(0);

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

  const calcRecargoNocturno = (
    entradaString,
    salidaString,
    entradaMilisegundos,
    salidaMilisegundos
  ) => {
    const fechaEntrada = darFormatoFecha(entradaString); //object
    const fechaSalida =
      entradaMilisegundos > salidaMilisegundos
        ? darFormatoFecha(salidaString, 1)
        : darFormatoFecha(salidaString, 0);

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
    }
    setHorasRecargoNocturnoState(horasRecargoNocturno);
    setHorasExtraState(horasExtras);
  };

  const inicioRecargoNocturno = darFormatoFecha("21:00", 0);
  const finRecargoNocturno = darFormatoFecha("06:00", 1);

  // --------------------------- RENDER --------------------------------------
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col">
          <h1>Calculadora de recargo nocturno y horas extras</h1>

          {/* <label htmlFor="inicioRecargo">Inicio recargo nocturno:</label>
<input
  type="time"
  id="inicioRecargo"
  name="inicioRecargo"
  value={inicioRecargo}
  onChange={(e) => setInicioRecargo(e.target.value)}
/>

<label htmlFor="finRecargo">Fin recargo nocturno:</label>
<input
  type="time"
  id="finRecargo"
  name="finRecargo"
  value={finRecargo}
  onChange={(e) => setFinRecargo(e.target.value)}
/> */}

          <label className="form-label" htmlFor="jornadaLaboral">
            Jornada laboral en horas:{" "}
          </label>
          <input
            className="form-control" //size
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
              <div class="row mt-3" key={index}>
                <p>Dia {dia}</p>
                <div class="col">
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
                <div class="col">
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
        </div>
      </div>

      {/* <table>
  <thead>
    <tr>
      <th>Trabajador</th>
      <th>Ingreso</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cell 1</td>
      <td>Cell 2</td>
    </tr>
  </tbody>
</table> */}
    </div>
  );
}

export default App;
