// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'dart:math';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        colorScheme: ColorScheme.fromSwatch(primarySwatch: Colors.blue),
        scaffoldBackgroundColor: const Color(0xFF0D1117),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF161B22),
          elevation: 0,
        ),
      ),
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> with TickerProviderStateMixin {
  // Decision categories with weighted responses
  final Map<String, List<DecisionResponse>> _decisionCategories = {
    'Career & Work': [
      DecisionResponse('Take the opportunity - growth awaits!', true, 'Consider the long-term benefits'),
      DecisionResponse('Research more before deciding', false, 'Gather additional information first'),
      DecisionResponse('Trust your instincts on this one', true, 'Your gut feeling matters'),
      DecisionResponse('Seek advice from a mentor', false, 'External perspective could help'),
      DecisionResponse('The timing seems right', true, 'Conditions appear favorable'),
      DecisionResponse('Wait for better circumstances', false, 'Patience might serve you better'),
    ],
    'Health & Wellness': [
      DecisionResponse('Start today - small steps count!', true, 'Consistency beats perfection'),
      DecisionResponse('Plan it out first', false, 'Preparation leads to success'),
      DecisionResponse('Make it a habit, not a goal', true, 'Focus on sustainable changes'),
      DecisionResponse('Find an accountability partner', false, 'Support systems are crucial'),
      DecisionResponse('Listen to your body', true, 'Your body knows what it needs'),
      DecisionResponse('Consult a professional first', false, 'Expert guidance is valuable'),
    ],
    'Relationships': [
      DecisionResponse('Open communication is key', true, 'Honest dialogue builds trust'),
      DecisionResponse('Give it more time', false, 'Some things need to develop naturally'),
      DecisionResponse('Actions speak louder than words', true, 'Show rather than tell'),
      DecisionResponse('Consider their perspective', false, 'Understanding others is crucial'),
      DecisionResponse('Trust your feelings', true, 'Emotions provide important data'),
      DecisionResponse('Set healthy boundaries', false, 'Protecting yourself enables growth'),
    ],
    'Personal Growth': [
      DecisionResponse('Challenge yourself - you\'re ready!', true, 'Growth happens outside comfort zones'),
      DecisionResponse('Reflect on your values first', false, 'Alignment with values ensures fulfillment'),
      DecisionResponse('Learn from past experiences', true, 'Your history contains wisdom'),
      DecisionResponse('Break it into smaller steps', false, 'Manageable chunks prevent overwhelm'),
      DecisionResponse('Embrace the uncertainty', true, 'Unknown outcomes can lead to discovery'),
      DecisionResponse('Build supportive habits first', false, 'Foundation work enables success'),
    ],
  };

  String _selectedCategory = 'Personal Growth';
  String _currentAdvice = 'Ask a question and tap for guidance!';
  String _currentGuidance = '';
  int _decisionsToday = 0;
  int _positiveActions = 0;
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rotationAnimation;
  
  final TextEditingController _questionController = TextEditingController();
  final List<String> _recentQuestions = [];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1, end: 1.2).animate(
      CurvedAnimation(parent: _controller, curve: Curves.elasticOut)
    );
    _rotationAnimation = Tween<double>(begin: 0, end: 0.5).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut)
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    _questionController.dispose();
    super.dispose();
  }

  void _getDecisionHelp() {
    if (_questionController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a question first!')),
      );
      return;
    }

    _controller.reset();
    _controller.forward();
    
    List<DecisionResponse> responses = _decisionCategories[_selectedCategory]!;
    DecisionResponse selectedResponse = responses[Random().nextInt(responses.length)];
    
    setState(() {
      _currentAdvice = selectedResponse.advice;
      _currentGuidance = selectedResponse.guidance;
      _decisionsToday++;
      if (selectedResponse.isPositive) {
        _positiveActions++;
      }
      
      // Add to recent questions
      if (!_recentQuestions.contains(_questionController.text.trim())) {
        _recentQuestions.insert(0, _questionController.text.trim());
        if (_recentQuestions.length > 5) {
          _recentQuestions.removeLast();
        }
      }
    });
  }

  void _resetStats() {
    setState(() {
      _decisionsToday = 0;
      _positiveActions = 0;
      _currentAdvice = 'Ask a question and tap for guidance!';
      _currentGuidance = '';
      _recentQuestions.clear();
    });
    _questionController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      child: Scaffold(
        appBar: AppBar(
          title: const Text(
            '🧠 Smart Decision Helper',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          centerTitle: true,
          actions: [
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: _resetStats,
              tooltip: 'Reset Progress',
            ),
          ],
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              // Progress Cards
              Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      'Decisions Today',
                      _decisionsToday.toString(),
                      Icons.psychology,
                      Colors.blue,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildStatCard(
                      'Positive Actions',
                      _positiveActions.toString(),
                      Icons.trending_up,
                      Colors.green,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              
              // Category Selection
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF21262D),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey[800]!),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Decision Category',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: _selectedCategory,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        filled: true,
                        fillColor: const Color(0xFF0D1117),
                      ),
                      items: _decisionCategories.keys.map<DropdownMenuItem<String>>((category) {
                        return DropdownMenuItem<String>(
                          value: category,
                          child: Text(category),
                        );
                      }).toList(),
                      onChanged: (String? value) {
                        setState(() {
                          _selectedCategory = value!;
                        });
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              
              // Question Input
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF21262D),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey[800]!),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'What decision are you facing?',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _questionController,
                      decoration: InputDecoration(
                        hintText: 'e.g., Should I take that new job offer?',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        filled: true,
                        fillColor: const Color(0xFF0D1117),
                        prefixIcon: const Icon(Icons.help_outline),
                      ),
                      maxLines: 2,
                      textInputAction: TextInputAction.done,
                      onSubmitted: (_) => _getDecisionHelp(),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              
              // Decision Ball
              GestureDetector(
                onTap: _getDecisionHelp,
                child: AnimatedBuilder(
                  animation: _controller,
                  builder: (context, child) {
                    return Transform.scale(
                      scale: _scaleAnimation.value,
                      child: Transform.rotate(
                        angle: _rotationAnimation.value * 2 * pi,
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF4F46E5), Color(0xFF7C3AED)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.purple.withOpacity(0.3),
                                blurRadius: 20,
                                offset: const Offset(0, 8),
                              ),
                            ],
                          ),
                          child: Column(
                            children: [
                              const Icon(
                                Icons.psychology,
                                size: 48,
                                color: Colors.white,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                _currentAdvice,
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              if (_currentGuidance.isNotEmpty) ...[
                                const SizedBox(height: 12),
                                Text(
                                  _currentGuidance,
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.white.withOpacity(0.8),
                                    fontStyle: FontStyle.italic,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 16),
              
              ElevatedButton.icon(
                onPressed: _getDecisionHelp,
                icon: const Icon(Icons.auto_awesome),
                label: const Text('Get Decision Help'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF238636),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              
              // Recent Questions
              if (_recentQuestions.isNotEmpty) ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF21262D),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey[800]!),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Recent Questions',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 12),
                      ..._recentQuestions.map<Widget>((question) {
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4),
                          child: Row(
                            children: [
                              Icon(Icons.history, size: 16, color: Colors.grey[400]),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  question,
                                  style: TextStyle(color: Colors.grey[300]),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF21262D),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[800]!),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 32),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey[400],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class DecisionResponse {
  final String advice;
  final bool isPositive;
  final String guidance;

  DecisionResponse(this.advice, this.isPositive, this.guidance);
}
