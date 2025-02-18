import Story from '../../database/models/storyModel';
import { UpdateStoryDTO } from '../../dtos/storyDTO';
import StoryRepository from '../../repositories/storyRepository';
import StoryService from '../../services/storyService';
import { NotFoundError } from '../../utils/errorClass';

jest.mock('../../repositories/storyRepository');

describe('StoryService', () => {
  const mockStoryData: Story = {
    title: 'Test Story',
    description: 'Test Description',
    authorUsername: 'Test User1',
    authorName: 'Test User',
  };

  const mockUpdatedStoryData: UpdateStoryDTO = {
    title: 'Updated Story',
    description: 'Updated Description',
  };

  const storyRepository = StoryRepository as jest.Mocked<
    typeof StoryRepository
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createStory - should create a story and return it', async () => {
    const mockNewStory = {
      id: 1,
      title: 'Test Story',
      description: 'Test Description',
      authorUsername: 'Test User 1',
      authorName: 'Test User',
    };
    storyRepository.createStory.mockResolvedValue(mockNewStory);

    const result = await StoryService.createStory(mockStoryData);

    expect(storyRepository.createStory).toHaveBeenCalledWith(mockStoryData);
    expect(result).toEqual(mockNewStory);
  });

  test('getAllStories - should return a list of stories', async () => {
    const mockStories = [
      {
        id: 1,
        title: 'Story 1',
        description: 'Description 1',
        authorUsername: 'User 1',
        authorName: 'User',
      },
      {
        id: 2,
        title: 'Story 2',
        description: 'Description 2',
        authorUsername: 'User 2',
        authorName: 'User',
      },
    ];
    storyRepository.getAllStories.mockResolvedValue(mockStories);

    const result = await StoryService.getAllStories(10, 0);

    expect(storyRepository.getAllStories).toHaveBeenCalledWith(10, 0);
    expect(result).toEqual(mockStories);
  });

  test('getStoryById - should return a story if found', async () => {
    const mockStory = {
      id: 1,
      title: 'Story 1',
      description: 'Description 1',
      authorUsername: 'User 1',
      authorName: 'USer',
    };
    storyRepository.getStoryById.mockResolvedValue(mockStory);

    const result = await StoryService.getStoryById(1);

    expect(storyRepository.getStoryById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockStory);
  });

  test('getStoryById - should throw NotFoundError if story not found', async () => {
    storyRepository.getStoryById.mockResolvedValue(null);

    await expect(StoryService.getStoryById(999)).rejects.toThrow(
      new NotFoundError('Story not found')
    );
  });

  test('updateStory - should update a story and return it', async () => {
    const userId = 1;
    const mockUpdatedStory = {
      id: 1,
      title: 'Updated Story',
      description: 'Updated Description',
      authorUsername: 'User 1',
      authorName: 'User',
    };
    storyRepository.updateStory.mockResolvedValue(mockUpdatedStory);

    const result = await StoryService.updateStory(userId, mockUpdatedStoryData);

    expect(storyRepository.updateStory).toHaveBeenCalledWith(
      userId,
      mockUpdatedStoryData
    );
    expect(result).toEqual(mockUpdatedStory);
  });

  test('updateStory - should throw NotFoundError if story not found', async () => {
    const userId = 999;
    storyRepository.updateStory.mockResolvedValue(null);

    await expect(
      StoryService.updateStory(userId, mockUpdatedStoryData)
    ).rejects.toThrow(new NotFoundError('Story not found'));
  });

  test('deleteStory - should delete the story and return true', async () => {
    const userId = 1;
    storyRepository.deleteStory.mockResolvedValue(true);

    const result = await StoryService.deleteStory(userId);

    expect(storyRepository.deleteStory).toHaveBeenCalledWith(userId);
    expect(result).toBe(true);
  });

  test('deleteStory - should throw NotFoundError if story not found', async () => {
    const userId = 999;
    storyRepository.deleteStory.mockResolvedValue(false);

    await expect(StoryService.deleteStory(userId)).rejects.toThrow(
      new NotFoundError('Story not found')
    );
  });
});
