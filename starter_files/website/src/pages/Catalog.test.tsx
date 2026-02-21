import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Catalog } from './Catalog';

// Mock react-router-dom hooks
const mockUseLocation = vi.fn();
const mockUseNavigate = vi.fn(() => vi.fn()); // Mock useNavigate to return a mock function

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
    useNavigate: () => mockUseNavigate(),
  };
});

// Comprehensive mock sessions mirroring the structure of sampleSessions.ts
const { mockSessions } = vi.hoisted(() => {
  const sessions = [
    {
      id: '1',
      title: 'Opening Keynote: The Future of AI',
      speaker: 'Dr. Evelyn Reed',
      category: 'Keynote',
      day: 'Day 1',
      time: '09:00 AM - 10:00 AM',
      location: 'Main Auditorium',
      description: 'Dr. Reed will share her vision for the future of artificial intelligence and its impact on society.',
      details: {
        fullDescription: 'Join Dr. Evelyn Reed, a pioneer in AI ethics and development, as she unveils her groundbreaking insights into the trajectory of artificial intelligence.',
        takeaways: ['Understand key AI trends'],
        tracks: ['AI & Machine Learning', 'Ethics in Tech'],
        level: 'Intermediate',
        speakerBio: 'Dr. Evelyn Reed is a world-renowned AI researcher.'
      }
    },
    {
      id: '2',
      title: 'Deep Learning for Beginners',
      speaker: 'Alex Chen',
      category: 'Learning Lab',
      day: 'Day 1',
      time: '10:30 AM - 12:00 PM',
      location: 'Room 101',
      description: 'An introductory workshop on deep learning fundamentals, neural networks, and TensorFlow.',
      details: {
        fullDescription: 'This hands-on learning lab is designed for those new to deep learning. Participants will gain a foundational understanding of neural networks.',
        takeaways: ['Neural network basics'],
        tracks: ['AI & Machine Learning'],
        level: 'Beginner',
        speakerBio: 'Alex Chen is a senior AI instructor.'
      }
    },
    {
      id: '3',
      title: 'Scaling Microservices with Kubernetes',
      speaker: 'Maria Garcia',
      category: 'Breakout',
      day: 'Day 1',
      time: '01:00 PM - 02:00 PM',
      location: 'Room 102',
      description: 'Learn best practices for deploying and scaling microservices using Kubernetes.',
      details: {
        fullDescription: 'Dive deep into the world of Kubernetes with Maria Garcia, a leading expert in cloud-native architectures.',
        takeaways: ['Kubernetes deployment strategies'],
        tracks: ['Cloud Native', 'DevOps'],
        level: 'Advanced',
        speakerBio: 'Maria Garcia is a Principal Cloud Architect.'
      }
    },
    {
      id: '4',
      title: 'Customer Story: AI in Healthcare',
      speaker: 'Dr. John Doe & Jane Smith',
      category: 'Customer Story',
      day: 'Day 2',
      time: '09:30 AM - 10:30 AM',
      location: 'Main Auditorium',
      description: 'A real-world case study on implementing AI solutions in a hospital setting to improve patient outcomes.',
      details: {
        fullDescription: 'Hear from Dr. John Doe, Chief Medical Officer, and Jane Smith, Head of AI Innovation, at HealthFirst Hospital.',
        takeaways: ['AI applications in healthcare'],
        tracks: ['Healthcare Tech', 'AI & Machine Learning'],
        level: 'Intermediate',
        speakerBio: 'Dr. John Doe is a visionary Chief Medical Officer. Jane Smith leads AI strategy.'
      }
    },
    {
      id: '5',
      title: 'Advanced Data Visualization with D3.js',
      speaker: 'Sophie Lee',
      category: 'Learning Lab',
      day: 'Day 2',
      time: '11:00 AM - 12:30 PM',
      location: 'Room 203',
      description: 'Master the art of creating stunning and interactive data visualizations using D3.js.',
      details: {
        fullDescription: 'This advanced learning lab will empower you to create bespoke and highly interactive data visualizations using D3.js.',
        takeaways: ['D3.js advanced techniques'],
        tracks: ['Frontend Development', 'Data Science'],
        level: 'Advanced',
        speakerBio: 'Sophie Lee is a freelance data visualization engineer.'
      }
    }
  ];
  return { mockSessions: sessions };
});

vi.mock('../data/sessions', () => ({
  SESSIONS: mockSessions,
}));

describe('Catalog Page', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockUseLocation.mockReturnValue({ search: '' });
    mockUseNavigate.mockReset();
  });

  it('renders all sessions initially', () => {
    render(
      <MemoryRouter>
        <Catalog />
      </MemoryRouter>
    );
    expect(screen.getByText('Opening Keynote: The Future of AI')).toBeInTheDocument();
    expect(screen.getByText('Deep Learning for Beginners')).toBeInTheDocument();
    expect(screen.getByText('Scaling Microservices with Kubernetes')).toBeInTheDocument();
    expect(screen.getByText('Customer Story: AI in Healthcare')).toBeInTheDocument();
    expect(screen.getByText('Advanced Data Visualization with D3.js')).toBeInTheDocument();
    expect(screen.getByText('Showing 5 sessions')).toBeInTheDocument();
  });

  it('filters by search query (title)', async () => {
    render(
      <MemoryRouter>
        <Catalog />
      </MemoryRouter>
    );
    const searchInput = screen.getByPlaceholderText(/Search sessions/i);
    fireEvent.change(searchInput, { target: { value: 'Deep Learning' } });

    expect(screen.getByText('Deep Learning for Beginners')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Opening Keynote: The Future of AI')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Showing 1 sessions')).toBeInTheDocument();
  });

  it('filters by search query (speaker)', async () => {
    render(
      <MemoryRouter>
        <Catalog />
      </MemoryRouter>
    );
    const searchInput = screen.getByPlaceholderText(/Search sessions/i);
    fireEvent.change(searchInput, { target: { value: 'Evelyn Reed' } });

    await waitFor(() => {
      expect(screen.getByText('Opening Keynote: The Future of AI')).toBeInTheDocument();
    });
    expect(screen.getByText('Showing 1 sessions')).toBeInTheDocument();
  });

  it('filters by search query (description)', async () => {
    render(
      <MemoryRouter>
        <Catalog />
      </MemoryRouter>
    );
    const searchInput = screen.getByPlaceholderText(/Search sessions/i);
    fireEvent.change(searchInput, { target: { value: 'Kubernetes' } });

    await waitFor(() => {
      expect(screen.getByText('Scaling Microservices with Kubernetes')).toBeInTheDocument();
    });
    expect(screen.getByText('Showing 1 sessions')).toBeInTheDocument();
  });

  it('filters by search query (fullDescription)', async () => {
    render(
      <MemoryRouter>
        <Catalog />
      </MemoryRouter>
    );
    const searchInput = screen.getByPlaceholderText(/Search sessions/i);
    fireEvent.change(searchInput, { target: { value: 'pioneer in AI ethics' } });

    await waitFor(() => {
      expect(screen.getByText('Opening Keynote: The Future of AI')).toBeInTheDocument();
    });
    expect(screen.getByText('Showing 1 sessions')).toBeInTheDocument();
  });

  it('filters by Day', async () => {
    render(
      <MemoryRouter>
        <Catalog />
      </MemoryRouter>
    );
    const daySelect = screen.getByRole('combobox', { name: /Filter by Day/i });
    fireEvent.change(daySelect, { target: { value: 'Day 2' } });

    await waitFor(() => {
      expect(screen.queryByText('Opening Keynote: The Future of AI')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Customer Story: AI in Healthcare')).toBeInTheDocument();
    expect(screen.getByText('Advanced Data Visualization with D3.js')).toBeInTheDocument();
    expect(screen.getByText('Showing 2 sessions')).toBeInTheDocument();
    expect(mockUseNavigate).toHaveBeenCalledWith({ search: 'day=Day+2' }, { replace: true });
  });

  it('filters by Category', async () => {
    render(
      <MemoryRouter>
        <Catalog />
      </MemoryRouter>
    );
    const categorySelect = screen.getByRole('combobox', { name: /Filter by Category/i });
    fireEvent.change(categorySelect, { target: { value: 'Learning Lab' } });

    await waitFor(() => {
      expect(screen.queryByText('Opening Keynote: The Future of AI')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Deep Learning for Beginners')).toBeInTheDocument();
    expect(screen.getByText('Advanced Data Visualization with D3.js')).toBeInTheDocument();
    expect(screen.getByText('Showing 2 sessions')).toBeInTheDocument();
    expect(mockUseNavigate).toHaveBeenCalledWith({ search: 'category=Learning+Lab' }, { replace: true });
  });

  it('filters by Speaker', async () => {
    render(
      <MemoryRouter>
        <Catalog />
      </MemoryRouter>
    );
    const speakerSelect = screen.getByRole('combobox', { name: /Filter by Speaker/i });
    fireEvent.change(speakerSelect, { target: { value: 'Maria Garcia' } });

    await waitFor(() => {
      expect(screen.getByText('Scaling Microservices with Kubernetes')).toBeInTheDocument();
    });
    expect(screen.getByText('Showing 1 sessions')).toBeInTheDocument();
    expect(mockUseNavigate).toHaveBeenCalledWith({ search: 'speaker=Maria+Garcia' }, { replace: true });
  });

  it('filters by Level', async () => {
    render(
      <MemoryRouter>
        <Catalog />
      </MemoryRouter>
    );
    const levelSelect = screen.getByRole('combobox', { name: /Filter by Level/i });
    fireEvent.change(levelSelect, { target: { value: 'Beginner' } });

    await waitFor(() => {
      expect(screen.getByText('Deep Learning for Beginners')).toBeInTheDocument();
    });
    expect(screen.getByText('Showing 1 sessions')).toBeInTheDocument();
    expect(mockUseNavigate).toHaveBeenCalledWith({ search: 'level=Beginner' }, { replace: true });
  });

  it('filters by Track', async () => {
    render(
      <MemoryRouter>
        <Catalog />
      </MemoryRouter>
    );
    const trackSelect = screen.getByRole('combobox', { name: /Filter by Track/i });
    fireEvent.change(trackSelect, { target: { value: 'Cloud Native' } });

    await waitFor(() => {
      expect(screen.getByText('Scaling Microservices with Kubernetes')).toBeInTheDocument();
    });
    expect(screen.getByText('Showing 1 sessions')).toBeInTheDocument();
    expect(mockUseNavigate).toHaveBeenCalledWith({ search: 'track=Cloud+Native' }, { replace: true });
  });

  it('applies filters from URL on initial render', async () => {
    mockUseLocation.mockReturnValue({ search: '?day=Day+1&category=Keynote' });
    render(
      <MemoryRouter initialEntries={['/catalog?day=Day+1&category=Keynote']}>
        <Catalog />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Opening Keynote: The Future of AI')).toBeInTheDocument();
      expect(screen.queryByText('Deep Learning for Beginners')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Showing 1 sessions')).toBeInTheDocument();
  });

  it('combines multiple filters correctly', async () => {
    render(
      <MemoryRouter>
        <Catalog />
      </MemoryRouter>
    );
    const daySelect = screen.getByRole('combobox', { name: /Filter by Day/i });
    fireEvent.change(daySelect, { target: { value: 'Day 1' } });

    const categorySelect = screen.getByRole('combobox', { name: /Filter by Category/i });
    fireEvent.change(categorySelect, { target: { value: 'Learning Lab' } });

    expect(screen.getByText('Deep Learning for Beginners')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Opening Keynote: The Future of AI')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Showing 1 sessions')).toBeInTheDocument();
    expect(mockUseNavigate).toHaveBeenCalledWith({ search: 'day=Day+1&category=Learning+Lab' }, { replace: true });
  });

  it('shows no results message when no matches for combined filters', async () => {
    render(
      <MemoryRouter>
        <Catalog />
      </MemoryRouter>
    );
    const daySelect = screen.getByRole('combobox', { name: /Filter by Day/i });
    fireEvent.change(daySelect, { target: { value: 'Day 2' } });

    const speakerSelect = screen.getByRole('combobox', { name: /Filter by Speaker/i });
    fireEvent.change(speakerSelect, { target: { value: 'Dr. Evelyn Reed' } });

    await waitFor(() => {
      expect(screen.getByText('No sessions found')).toBeInTheDocument();
    });
    expect(screen.getByText('Showing 0 sessions')).toBeInTheDocument();
    expect(mockUseNavigate).toHaveBeenCalledWith({ search: 'day=Day+2&speaker=Dr.+Evelyn+Reed' }, { replace: true });
  });
});
