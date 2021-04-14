import { useEffect, useRef, useState } from "react";

export default function Example() {
  const columnInputRef = useRef();
  const lineInputRef = useRef();
  const fileInputRef = useRef();

  const [result, setResult] = useState();

  useEffect(() => {
    window.sourceMap.SourceMapConsumer.initialize({
      "lib/mappings.wasm":
        "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm",
    });
  }, []);

  function readFileAsString(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        resolve(event.target.result);
      };
      reader.readAsText(file);
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const columnNumber = columnInputRef.current.value;
    const lineNumber = lineInputRef.current.value;
    const file = fileInputRef.current.files[0];

    const sourceMap = await readFileAsString(file);

    const { SourceMapConsumer } = window.sourceMap;

    const consumer = await new SourceMapConsumer(sourceMap);

    const position = consumer.originalPositionFor({
      column: parseInt(columnNumber, 10), // 5290
      line: parseInt(lineNumber, 10),
    });

    setResult({
      source: position.source,
      column: position.column,
      line: position.line,
    });
  }

  return (
    <div>
      <style jsx>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          /* display: none; <- Crashes Chrome on hover */
          -webkit-appearance: none;
          margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
        }

        input[type="number"] {
          -moz-appearance: textfield; /* Firefox */
        }
      `}</style>
      <div className="bg-white">
        <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
              JavaScript
            </h2>
            <h1 className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Source Map Resolver
            </h1>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Map the line and column number from a minified JavaScript file to
              it's corresponding source.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div>
                  <div className="flex flex-col sm:flex-row">
                    <div className="flex-1">
                      <label
                        htmlFor="column_number"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Column number
                      </label>
                      <div className="mt-1">
                        <input
                          ref={columnInputRef}
                          type="number"
                          name="column_number"
                          id="column_number"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="2"
                        />
                      </div>
                    </div>
                    <div className="w-6 h-6"></div>
                    <div className="flex-1">
                      <label
                        htmlFor="line_number"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Line number
                      </label>
                      <div className="mt-1">
                        <input
                          ref={lineInputRef}
                          type="number"
                          name="line_number"
                          id="line_number"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="38152"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    These should specify the position in the minified JavaScript
                    file.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Source map file
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex justify-center text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            ref={fileInputRef}
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        JavaScript source maps (usually{" "}
                        <span className="font-mono bg-gray-100 py-px px-1 rounded">
                          .map
                        </span>
                        )
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Find source
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {result && (
        <>
          <div className="relative bg-gray-50">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-gray-50 text-lg font-medium text-gray-900">
                Results
              </span>
            </div>
          </div>
          <div className="bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Source Code Location
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    This will be the location of the code in your actual source
                    code, not the minified version.
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        Source
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {result.source}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Line
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {result.line}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Column
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {result.column}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <footer className="bg-white">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a
              href="https://github.com/leodr/source-map-resolver"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">GitHub</span>
              <svg
                className="h-6 w-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; {new Date().getFullYear()} Leo Driesch. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
