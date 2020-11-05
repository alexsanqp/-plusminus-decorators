export interface MemorizeOptions {
  /**
   * This is the size of the list that needs to be cached, the default value is 20,
   * this means that we can cache a list that does not exceed 20 elements.
   *
   * @Default 20
   */
  size?: number;

  /**
   * This is cache expiration time in milliseconds.
   *
   * @Default 0 ms.
   */
  duration?: number;
}
