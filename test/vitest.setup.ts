import { cleanup } from '@testing-library/react'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './server'

// Start the interception.
beforeAll(() => server.listen())

// Reset handlers so that each test could alter them
// without affecting other, unrelated tests.
afterEach(() => {
    server.resetHandlers()
    // Can be avoided if we setup vitest to inject afterEach to each test.
    // https://testing-library.com/docs/react-testing-library/api/#cleanup
    cleanup()
})

// Clean up once the tests are done.
afterAll(() => server.close())
