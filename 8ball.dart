import 'package:flutter/material.dart';
import 'dart:math';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> with TickerProviderStateMixin {
  final List<String> _responses = [
    'Yes', 'No', 'Maybe', 'Ask again later', 'Definitely', 'Not sure', 'Absolutely', 'Try again'
  ];

  String _currentResponse = 'Tap to get an answer!';
  int _score = 0;
  int _level = 1;
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
    _animation = Tween<double>(begin: 0, end: 1).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _shakeBall() {
    _controller.reset();
    _controller.forward();
    String newResponse = _responses[Random().nextInt(_responses.length)];
    setState(() {
      _currentResponse = newResponse;
      if (newResponse == 'Yes' || newResponse == 'Definitely' || newResponse == 'Absolutely') {
        _score += _level;
      } else {
        _score = max(0, _score - _level);
      }
    });

    if (_score >= _level * 10) {
      setState(() {
        _level++;
        _score = 0;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        backgroundColor: Colors.black,
        appBar: AppBar(
          backgroundColor: Colors.grey[900],
          title: const Text(
            '🎱 Magic 8-Ball Game 🎱',
            style: TextStyle(color: Colors.white),
          ),
          centerTitle: true,
        ),
        body: GestureDetector(
          onTap: _shakeBall,
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Level: $_level',
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                Text(
                  'Score: $_score',
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                const SizedBox(height: 20),
                RotationTransition(
                  turns: _animation,
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 500),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.blueAccent,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      _currentResponse,
                      style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  'Tap anywhere to shake the ball!',
                  style: TextStyle(fontSize: 18, color: Colors.grey),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      _score = 0;
                      _level = 1;
                      _currentResponse = 'Tap to get an answer!';
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.redAccent,
                    foregroundColor: Colors.white,
                  ),
                  child: const Text('Reset Game'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
