import { useContext } from "react";
import { TaskContext } from "./context/TaskContext";

function App() {
  const taskContext = useContext(TaskContext);

  if (!taskContext) {
    throw new Error("App must be used within TaskContextProvider");
  }

  const { task} = taskContext ;

  return (
    <>
      <div className="text-center text-4xl font-bold">App</div>
      {/* <p>Total Tasks: {task.length}</p> */}
    </>
  );
}

export default App;
