import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './tests/server'

// Start the interception.
beforeAll(() => server.listen())

// Reset handlers so that each test could alter them
// without affecting other, unrelated tests.
afterEach(() => server.resetHandlers())

// Clean up once the tests are done.
afterAll(() => server.close())
