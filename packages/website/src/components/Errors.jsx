export default function Errors({ errors }) {
  if (errors.length > 0) {
    return (
      <div className="errors">
        <table>
          <tbody>
            {errors.map((e, i) => {
              return (
                <tr key={i}>
                  <td className="level">{e.level ? <span className={e.level}>{e.level}</span> : null}</td>
                  <td className="message">{e.message}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
