class StateMachine {
  /**
   * Creates a new state machine.
   *
   * @param {string} initialState the initial state of the machine
   * @param {Record<string, string[]>} stateMap a map of states to their valid next states
   */
  constructor(initialState, stateMap) {
    /**
     * @private
     * @type {string} the current internal state
     */
    this._state = initialState;

    /**
     * @private
     * @type {Record<string, Set<string>>} a map of states to their valid next states
     */
    this._map = Object.entries(stateMap).reduce(
      (acc, [state, nextStates]) => ({
        ...acc,
        [state]: new Set(nextStates),
      }),
      {},
    );
  }

  /**
   * @type {string} the current state of the machine
   */
  get state() {
    return this._state;
  }

  /**
   * Checks whether the current state is any of the given ones.
   *
   * @example
   * ```js
   * const isMounted = stateMachine.isStateOneOf(['beforeMount', 'mounted', 'beforeUnmount']);
   * ```
   *
   * @param {...string} states the different states to check
   * @returns {boolean} whether the current state is one of the given ones
   */
  isStateOneOf(...states) {
    return new Set(states).has(this._state);
  }

  /**
   * Sets the current state, granted that the given state is valid to move to from
   * the current state in the machine.
   *
   * @param {string} newState the new state to move to
   */
  setState(newState) {
    const validStates = this._map[this._state];
    if (!validStates) {
      throw new Error(`Modal gallery is in unknown state: ${this._state}`);
    }

    if (validStates.has(newState)) {
      this._state = newState;
    } else if (process.env.NODE_ENV === 'development') {
      const validStatesList = Array.from(validStates)
        .map(state => `"${state}"`)
        .join(',');
      console.warn(
        `Modal gallery is in state "${this._state}".\nFrom here, it can only be in one of the following states: ${validStatesList}`,
      );
    }
  }
}

export default StateMachine;
