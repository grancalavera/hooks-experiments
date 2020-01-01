import React, { memo, useContext, useReducer } from "react";

const AppContext = React.createContext({
  loading: false,
  aboveTreeDepth: 0,
  belowTreeDepth: 0,
  toggleLoading: (): void => {
    throw new Error("toggleLoading not implemented");
  },
});

const AppContextProvider: React.FC = ({ children }) => {
  const [loading, toggleLoading] = useReducer((isLoading: boolean) => !isLoading, false);

  const aboveTreeDepth = 0;
  const belowTreeDepth = 10;

  return (
    <AppContext.Provider
      value={{ loading, toggleLoading, aboveTreeDepth, belowTreeDepth }}
    >
      {children}
    </AppContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <TheApp />
    </AppContextProvider>
  );
};

const TheApp: React.FC = () => {
  const { loading, aboveTreeDepth, belowTreeDepth, toggleLoading } = useContext(
    AppContext
  );
  return (
    <div>
      <DeepTreeToggler
        label={"above"}
        treeDepth={aboveTreeDepth}
        toggleLoading={toggleLoading}
      />
      <DeepTreeToggler
        label={"below"}
        treeDepth={belowTreeDepth}
        toggleLoading={toggleLoading}
      />
      <p>{loading ? "loading" : "not loading"}</p>
    </div>
  );
};

type DeepTreeTogglerProps = DeepTreeProps & {
  toggleLoading: () => void;
};

const DeepTreeToggler: React.FC<DeepTreeTogglerProps> = memo(
  ({ label, treeDepth, toggleLoading }) => {
    return (
      <>
        <DeepTree label={label} treeDepth={treeDepth} />
        <button onClick={() => toggleLoading()}>Toggle Loading from {label}</button>
      </>
    );
  }
);

interface DeepTreeProps {
  label: string;
  treeDepth?: number;
}

const DeepTree: React.FC<DeepTreeProps> = ({ label, treeDepth = 0 }) => {
  console.count(`${label} render count`);

  return [...Array(treeDepth)]
    .map((_, i) => treeDepth - i)
    .reduce((nested, level) => {
      return <Nester level={level}>{nested}</Nester>;
    }, <p>{label}</p>);
};

interface NesterProps {
  level: number;
}

const Nester: React.FC<NesterProps> = ({ children, level }) => {
  console.count(`nester level ${level} render count`);
  return (
    <div className="nested-component">
      level: {level}
      {children}
    </div>
  );
};

export default App;
