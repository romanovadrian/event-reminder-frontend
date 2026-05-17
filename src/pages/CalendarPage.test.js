import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CalendarPage from "./CalendarPage";
import { useReminders } from "../context/ReminderContext";

jest.mock("../context/ReminderContext", () => ({
  useReminders: jest.fn(),
}));

const mockedUseReminders = useReminders;

function setRemindersState(overrides = {}) {
  const defaults = {
    reminders: [],
    isLoading: false,
    error: null,
    refresh: jest.fn(),
  };

  mockedUseReminders.mockReturnValue({ ...defaults, ...overrides });
}

describe("CalendarPage", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-12-15T00:00:00.000Z"));
    mockedUseReminders.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("moves to next month and rolls over year", async () => {
    setRemindersState();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<CalendarPage />);

    expect(
      screen.getByRole("heading", { name: "December 2026" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(
      screen.getByRole("heading", { name: "January 2027" }),
    ).toBeInTheDocument();
  });

  test("moves to previous month and rolls back year", async () => {
    setRemindersState();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<CalendarPage />);

    expect(
      screen.getByRole("heading", { name: "December 2026" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /previous/i }));

    expect(
      screen.getByRole("heading", { name: "November 2026" }),
    ).toBeInTheDocument();

    for (let i = 0; i < 10; i++) {
      await user.click(screen.getByRole("button", { name: /previous/i }));
    }

    expect(
      screen.getByRole("heading", { name: "January 2026" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /previous/i }));

    expect(
      screen.getByRole("heading", { name: "December 2025" }),
    ).toBeInTheDocument();
  });

  test("renders error state with header and retry action", async () => {
    const refresh = jest.fn();
    setRemindersState({ error: "Something went wrong", refresh });
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<CalendarPage />);

    expect(
      screen.getByRole("heading", { name: "December 2026" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /retry/i }));

    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
