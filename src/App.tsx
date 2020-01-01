import React, { useContext, useReducer, memo } from "react";

const AppContext = React.createContext({
  toggled: false,
  toggleValue: (): void => {
    throw new Error("toggleValue not implemented");
  },
});

const AppContextProvider: React.FC = ({ children }) => {
  const [toggled, toggleValue] = useReducer((isToggled: boolean) => !isToggled, false);
  return (
    <AppContext.Provider value={{ toggled, toggleValue }}>{children}</AppContext.Provider>
  );
};

const DeepTreeContext = React.createContext({
  depth: 0,
  label: "deep tree",
  toggleValue: (): void => {
    throw new Error("toggleValue not implemented");
  },
});

interface DeepTreeProps {
  toggleValue: () => void;
  label: string;
  depth: number;
}

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <ToggleMonitor />
      <DeepTreeApp />
    </AppContextProvider>
  );
};

const DeepTreeApp: React.FC = () => {
  const { toggleValue } = useContext(AppContext);
  return (
    <div>
      <DeepTreeToggler label="above" depth={5} toggleValue={toggleValue} />
      <DeepTreeToggler label="below" depth={30} toggleValue={toggleValue} />
    </div>
  );
};

const DeepTreeToggler: React.FC<DeepTreeProps> = memo(({ toggleValue, label, depth }) => {
  return (
    <DeepTreeContext.Provider value={{ toggleValue, label, depth }}>
      <DeepTree />
    </DeepTreeContext.Provider>
  );
});

const DeepTree: React.FC = () => {
  const { label, depth } = useContext(DeepTreeContext);
  console.count(`${label} render count`);

  return Array.from({ length: depth }, (_, i) => i).reduce(
    (nested, level) => {
      return <Nester level={level}>{nested}</Nester>;
    },
    <>
      {label} (<ToggleMonitor />)
      <Toggler />
    </>
  );
};

interface NesterProps {
  level: number;
}

const Nester: React.FC<NesterProps> = ({ children, level }) => {
  const { label, depth } = useContext(DeepTreeContext);
  console.count(`nester level ${level} render count`);
  return (
    <div className="nested-component">
      level: {level}, label: {label}, tree depth: {depth}
      {children}
    </div>
  );
};

const Toggler: React.FC = () => {
  const { toggleValue, label } = useContext(DeepTreeContext);
  return <button onClick={() => toggleValue()}>Toggle from {label}</button>;
};

const ToggleMonitor: React.FC = () => {
  const { toggled } = useContext(AppContext);
  console.count("toggle monitor render count");
  return <span>{toggled ? "toggled" : "not toggled"}</span>;
};

export default App;
